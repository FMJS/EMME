DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
java -XX:ParallelGCThreads=1 -jar $DIR/Alloy_Interface.jar
