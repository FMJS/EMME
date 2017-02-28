FROM fedora
WORKDIR /tmp
RUN pwd

RUN yum install -y wget unzip @development-tools python-pip swig python automake libtool gmp-devel gmp-*  curl which nano python-devel boost-devel gcc-c++ java
RUN wget https://github.com/FMJS/EMME/archive/master.zip
RUN unzip master.zip
RUN cd EMME-master/ext_tools && bash ./get_CVC4.sh
ENV PYTHONPATH="/tmp/EMME-master/ext_tools/CVC4/python_bindings":$PYTHONPATH
RUN cd EMME-master && make
RUN rm master.zip
RUN yum install -y clang clang-devel llvm llvm-devel lbzip2 ncurses-devel
RUN ln -s /usr/lib64/libtinfo.so /usr/lib64/libtinfo.so.5
RUN cd EMME-master/ext_tools && git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
ENV PATH="/tmp/EMME-master/ext_tools/depot_tools":$PATH
RUN cd EMME-master/ext_tools && mkdir v8 && cd v8 && fetch v8 && cd v8 && git checkout 6d82e6182b765f5111724908d0579ea84a5141ea && ./tools/dev/v8gen.py x64.release && ninja -C out.gn/x64.release -j 4
RUN cd EMME-master && echo "/tmp/EMME-master/ext_tools/v8/v8/out.gn/x64.release/d8 --harmony_sharedarraybuffer \$1" > run_v8.sh && chmod +x run_v8.sh
