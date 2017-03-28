FROM fedora:25
WORKDIR /home/fmjs

RUN dnf install -y wget unzip @development-tools python-pip swig python graphviz automake libtool gmp-devel gmp-*  curl which nano python-devel boost-devel gcc-c++ java
RUN wget https://github.com/FMJS/EMME/archive/master.zip
RUN unzip master.zip
RUN cd EMME-master/ext_tools && bash ./get_CVC4.sh
ENV PYTHONPATH="/home/fmjs/EMME-master/ext_tools/CVC4/python_bindings":$PYTHONPATH
RUN cd EMME-master && make
RUN rm master.zip
RUN cd EMME-master/ext_tools && wget https://github.com/cristian-mattarei/compiled_softwares/raw/master/v8/fedora-25-64/package.zip && unzip package.zip
RUN cd EMME-master/ext_tools && echo "`pwd`/v8/v8/out/x64.release/d8 --test --random-seed=\$RANDOM --use-strict --nohard-abort --nodead-code-elimination --nofold-constants `pwd`/v8/v8/test/test262/data/harness/sta.js `pwd`/v8/v8/test/test262/data/harness/assert.js `pwd`/v8/v8/test/test262/harness-adapt.js `pwd`/v8/v8/test/test262/harness-agent.js --harmony-sharedarraybuffer \$1" > run_v8.sh && echo "for file in \`find \$1 -name \"*.js\"\`; do python litmus.py -c \"bash `pwd`/run_v8.sh\" -i \$file -s -n \$2 -j 1; done" > run_all_v8.sh

