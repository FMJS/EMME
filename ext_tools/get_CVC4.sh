#!/bin/bash
pushd .
rm -fr CVC4 master.zip
wget https://github.com/CVC4/CVC4/archive/1.5.x.zip
unzip 1.5.x.zip
mv CVC4-1.5.x CVC4
cd CVC4/contrib
./get-antlr-3.4
cd ../
./autogen.sh
./configure --with-antlr-dir=$PWD/antlr-3.4 ANTLR=$PWD/antlr-3.4/bin/antlr3 --enable-optimized --enable-language-bindings=python
make
mkdir python_bindings
cd python_bindings
cp `find ../ -name "CVC4.so"` _CVC4.so
cp `find ../ -name "CVC4.py"` CVC4.py
export PYTHONPATH=$PWD
echo "================================================================================"
echo "run export PYTHONPATH=$PWD"
popd
