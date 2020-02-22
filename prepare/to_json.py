import xml.etree.ElementTree as ET
import json
from os import path
from urllib import request
import zipfile
from io import BytesIO

xmlpath = path.join(path.dirname(__file__), '../ucd/ucd.all.grouped.xml')
if not path.exists(xmlpath):
    print("xml file not found")
    req = request.Request('http://www.unicode.org/Public/UCD/latest/ucdxml/ucd.all.grouped.zip')
    body = ""
    with request.urlopen(req) as res:
        body = res.read()
    print("xml download done")
    fp = BytesIO(body)
    with zipfile.ZipFile(fp, 'r') as zip:
        with zip.open('ucd.all.grouped.xml') as file:
            extracted = file.read()
            with open(xmlpath, 'wb') as f:
                f.write(extracted)
    print("xml file saved")

tree = ET.parse(xmlpath)
print("file parsed")
NAMESPACE='http://www.unicode.org/ns/2003/ucd/1.0'
namespaces = {
    'ucd': NAMESPACE
}
root = tree.getroot()
groups = []
for g in root.find('ucd:repertoire', namespaces=namespaces):
    if g.tag.endswith("}group"):
        chars = []
        for c in g.findall('ucd:char', namespaces=namespaces) or []:
            char = {}
            char.update(c.attrib)
            aliases = []
            for a in c.findall('ucd:name-alias', namespaces=namespaces) or []:
                aliases += [a.attrib]
            if len(aliases) > 0:
                char['aliases'] = aliases
            chars += [char]
        group = {"chars": chars, "attrs": g.attrib}
        groups += [group]
    else:
        raise Exception("error")
blocks = []
for b in root.find('ucd:blocks', namespaces=namespaces):
    blocks += [b.attrib]
dest = path.join(path.dirname(__file__), '../dist/ucd.json')
with open(dest, "w") as f:
    f.write(json.dumps({'groups': groups, 'blocks': blocks}))