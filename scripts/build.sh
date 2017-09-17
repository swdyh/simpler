#!/bin/sh +x

NAME=`ruby -rjson -e 'puts JSON.parse(File.read("src/package.json"))["name"]'`
APP=$NAME.app
ARCH=x64
PLATFORM=darwin
APP_VERSION=`ruby -rjson -e 'puts JSON.parse(File.read("src/package.json"))["version"]'`
ELECTRON_VERSION=`electron -v | sed s/v//g`

if [ "$CERT_NAME" != "" ]; then
    SIGN_OPT="--osx-sign '$CERT_NAME'"
else
    SIGN_OPT=""
fi

PKG_DIR=packages/$APP_VERSION/$PLATFORM-$ARCH
APP_PATH=$PKG_DIR/$APP
rm -rf $APP_PATH

cd src
electron-packager . $NAME \
                  --platform=$PLATFORM \
                  --arch=$ARCH \
                  --electronVersion $ELECTRON_VERSION \
                  --icon=../icon/icon.icns \
                  --overwrite \
                  --ignore '(\.DS_Store|\.gitignore|\.eslintrc.json|\.env)' $SIGN_OPT \
                  --app-bundle-id='io.github.swdyh.simpler' \
                  --app-category-type='public.app-category.utilities'

# category
# https://developer.apple.com/library/content/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8

cd ../
mkdir -p $PKG_DIR
mv src/$NAME-$PLATFORM-$ARCH/$APP $APP_PATH
rm -rf src/$NAME-$PLATFORM-$ARCH

echo

if [ "$SIGN_OPT" != "" ]; then
    spctl -a -v $APP_PATH 2>&1 | head -n 1
    spctl -a -v "$APP_PATH/Contents/Frameworks/Simpler Helper EH.app"  2>&1 | head -n 1
    spctl -a -v "$APP_PATH/Contents/Frameworks/Simpler Helper NP.app" 2>&1 | head -n 1
    spctl -a -v "$APP_PATH/Contents/Frameworks/Simpler Helper.app" 2>&1 | head -n 1
fi

# echo
# ls -alR $APP_PATH/Contents/Resources/app
# echo
# du -sh $APP_PATH
