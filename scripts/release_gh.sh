#!/bin/sh

NAME=`ruby -rjson -e 'puts JSON.parse(File.read("package.json"))["name"]'`
APP=$NAME.app
ARCH=x64
PLATFORM=darwin
APP_VERSION=`ruby -rjson -e 'puts JSON.parse(File.read("package.json"))["version"]'`
f="$NAME-$PLATFORM-$ARCH-$APP_VERSION.zip"
cd packages/$APP_VERSION/$PLATFORM-$ARCH
zip -r $f $NAME.app
mv $f ../../../
cd ../../../
hub release create -m "$APP_VERSION" -a $f $APP_VERSION
#rm $f
