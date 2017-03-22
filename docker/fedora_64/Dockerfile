FROM fedora
WORKDIR /home/fmjs

RUN yum install -y wget unzip @development-tools python-pip swig python graphviz automake libtool gmp-devel gmp-*  curl which nano python-devel boost-devel gcc-c++ java
RUN wget https://github.com/FMJS/EMME/archive/master.zip
RUN unzip master.zip
RUN cd EMME-master/ext_tools && bash ./get_CVC4.sh
ENV PYTHONPATH="/home/fmjs/EMME-master/ext_tools/CVC4/python_bindings":$PYTHONPATH
RUN cd EMME-master && make
RUN rm master.zip
RUN yum install -y clang clang-devel llvm llvm-devel lbzip2 ncurses-devel
RUN ln -s /usr/lib64/libtinfo.so /usr/lib64/libtinfo.so.5
RUN cd EMME-master/ext_tools && git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
ENV PATH="/home/fmjs/EMME-master/ext_tools/depot_tools":$PATH
RUN cd EMME-master/ext_tools && bash ./get_v8.sh
