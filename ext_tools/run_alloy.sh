DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
java -Djava.library.path=$DIR/amd64-linux/ -jar $DIR/Alloy_Interface.jar
