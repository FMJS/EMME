#!/bin/bash
BINDINGS="`pwd`/CVC4/python_bindings/CVC4.py"
if [ ! -f "$BINDINGS" ]; then
    pushd .
    wget https://downloads.sourceforge.net/project/swig/swig/swig-3.0.12/swig-3.0.12.tar.gz
    tar xvf swig-3.0.12.tar.gz
    cd swig-3.0.12
    ./configure --prefix=/usr
    make
    sudo make install
    cd ..
    rm -fr CVC4
    wget https://github.com/CVC4/CVC4/archive/master.zip
    unzip master.zip
    rm -fr master.zip
    mv CVC4-master CVC4
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
    export PYTHONPATH=$PWD:$PYTHONPATH
    export LD_LIBRARY_PATH=$PWD:$LD_LIBRARY_PATH
    echo "================================================================================"
    echo "run export PYTHONPATH=$PWD"
    popd
else
    echo "CVC4 Python bindings already exists!"
fi
