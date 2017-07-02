#!/bin/sh
v=$(cat  package.json | ruby -rjson -e 'puts JSON.parse(ARGF.read)["version"]')
f="simplenote-electro-darwin-x64-$v.zip"
cd packages/$v/darwin-x64
zip -r $f SimplenoteElectro.app
mv $f ../../../
cd ../../../
hub release create -m "$v" -a $f $v
rm $f
