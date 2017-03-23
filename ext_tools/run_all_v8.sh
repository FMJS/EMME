for file in `find $1 -name "*.js"`; do python litmus.py -c "bash /home/mattarei/repos-cos/EMME/ext_tools/run_v8.sh" -i $file -s -n $2 -j 1; done
