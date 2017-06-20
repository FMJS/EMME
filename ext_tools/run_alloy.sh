pushd `dirname $0` > /dev/null
DIR=`pwd -P`
popd > /dev/null
echo $DIR
java -Djava.library.path=$DIR/amd64-linux/ -jar $DIR/Alloy_Interface.jar
