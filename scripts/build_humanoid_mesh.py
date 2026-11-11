"""Bake the Unitree G1 upper body (from MuJoCo Menagerie) into a compact mesh for the hero.

Usage: python3 scripts/build_humanoid_mesh.py <path to mujoco_menagerie/unitree_g1>

Walks the MJCF from torso_link down, poses the arms, merges every visual mesh into
the torso_link frame (the waist joints' pivot), clusters vertices to shrink it, and writes
public/models/g1-bust.bin:
  uint32 vertexCount, uint32 indexCount,
  float32[3*vertexCount] positions (three.js axes: x = robot left, y = up, z = forward),
  uint8[vertexCount] material (0 = dark shell, 255 = light metal), padded to 4 bytes,
  uint32[indexCount] indices
"""
import os
import struct
import sys
import xml.etree.ElementTree as ET

import numpy as np

ROOT = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'models', 'g1-bust.bin')
CLUSTER = 0.0035  # metres; about one dither cell at the hero's size

# Relaxed standing pose for the arms (radians). Everything else stays at zero.
POSE = {
    'left_shoulder_pitch_joint': 0.15, 'right_shoulder_pitch_joint': 0.15,
    'left_shoulder_roll_joint': 0.12, 'right_shoulder_roll_joint': -0.12,
    'left_elbow_joint': 0.55, 'right_elbow_joint': 0.55,
}


def quat_to_mat(q):
    w, x, y, z = q / np.linalg.norm(q)
    return np.array([
        [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
        [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
        [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)],
    ])


def axis_angle(axis, angle):
    axis = np.asarray(axis, float) / np.linalg.norm(axis)
    return quat_to_mat(np.concatenate([[np.cos(angle / 2)], axis * np.sin(angle / 2)]))


def vec(el, name, default):
    return np.array([float(v) for v in el.get(name, default).split()])


def read_stl(path):
    data = open(path, 'rb').read()
    count = struct.unpack_from('<I', data, 80)[0]
    if 84 + count * 50 != len(data):
        raise ValueError(f'{path} is not a binary STL')
    rec = np.frombuffer(data, dtype=np.dtype([('n', '<f4', 3), ('v', '<f4', (3, 3)), ('a', '<u2')]), offset=84, count=count)
    return rec['v'].reshape(-1, 3).astype(np.float64)


tree = ET.parse(os.path.join(ROOT, 'g1.xml')).getroot()
mesh_files = {}
for mesh in tree.iter('mesh'):
    file = mesh.get('file')
    mesh_files[mesh.get('name', os.path.splitext(file)[0])] = os.path.join(ROOT, 'assets', file)

torso = next(b for b in tree.iter('body') if b.get('name') == 'torso_link')
positions, materials = [], []


def walk(body, R, t, is_root=False):
    if not is_root:
        t = t + R @ vec(body, 'pos', '0 0 0')
        R = R @ quat_to_mat(vec(body, 'quat', '1 0 0 0'))
        for joint in body.findall('joint'):
            R = R @ axis_angle(vec(joint, 'axis', '0 0 1'), POSE.get(joint.get('name'), 0.0))
    for geom in body.findall('geom'):
        # Skip the chest wordmark so the figure doesn't read as a brand endorsement.
        if geom.get('class') != 'visual' or 'mesh' not in geom.attrib or geom.get('mesh') == 'logo_link':
            continue
        gR = R @ quat_to_mat(vec(geom, 'quat', '1 0 0 0'))
        gt = t + R @ vec(geom, 'pos', '0 0 0')
        verts = read_stl(mesh_files[geom.get('mesh')]) @ gR.T + gt
        positions.append(verts)
        dark = geom.get('material') == 'black'
        materials.append(np.full(len(verts), 0 if dark else 255, np.uint8))
    for child in body.findall('body'):
        walk(child, R, t)


walk(torso, np.eye(3), np.zeros(3), is_root=True)
verts = np.concatenate(positions)
mats = np.concatenate(materials)

# Vertex clustering: snap to a grid, merge, drop triangles that collapse.
keys = np.round(verts / CLUSTER).astype(np.int64)
_, first, inverse = np.unique(keys, axis=0, return_index=True, return_inverse=True)
inverse = inverse.reshape(-1)
tris = inverse.reshape(-1, 3)
tris = tris[(tris[:, 0] != tris[:, 1]) & (tris[:, 1] != tris[:, 2]) & (tris[:, 0] != tris[:, 2])]
# Drop duplicate triangles (same corners), keeping the original winding.
_, keep = np.unique(np.sort(tris, axis=1), axis=0, return_index=True)
tris = tris[np.sort(keep)]

# Renumber to only the vertices still in use.
used, tris = np.unique(tris, return_inverse=True)
tris = tris.reshape(-1, 3)
out_pos = verts[first[used]]
out_mat = mats[first[used]]

# MuJoCo (x forward, y left, z up) -> three.js (x = robot left / viewer right, y up, z toward viewer).
out_pos = out_pos[:, [1, 2, 0]].astype(np.float32)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, 'wb') as f:
    f.write(struct.pack('<II', len(out_pos), tris.size))
    f.write(out_pos.tobytes())
    f.write(out_mat.tobytes())
    f.write(b'\0' * ((-len(out_mat)) % 4))
    f.write(tris.astype(np.uint32).tobytes())

lo, hi = out_pos.min(0), out_pos.max(0)
print(f'{len(out_pos)} vertices, {len(tris)} triangles, {os.path.getsize(OUT) / 1024:.0f} KiB')
print('bounds (three axes):', lo.round(3), hi.round(3))
