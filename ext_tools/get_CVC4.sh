#!/bin/bash
pushd .
rm -fr CVC4 master.zip
wget https://github.com/CVC4/CVC4/archive/master.zip
unzip master.zip
mv CVC4-master CVC4
cd CVC4/contrib
./get-antlr-3.4
cd ../
./autogen.sh
./configure --with-antlr-dir=$PWD/antlr-3.4 ANTLR=$PWD/antlr-3.4/bin/antlr3 --enable-optimized --enable-language-bindings=python
make
make install
mkdir python_bindings
cd python_bindings
cp /usr/local/share/pyshared/CVC4.py .
cp /usr/local/lib/pyshared/CVC4.so _CVC4.so
export PYTHONPATH=$PWD
echo "run export PYTHONPATH=$PWD"
popd
