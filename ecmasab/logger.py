import sys
import time

class Logger(object):
    verbosity = 0
    id_timer = 0
    timers = []
    time = False
    
    @staticmethod        
    def msg(msg, level, condition=True, max_level=10):
        if (Logger.verbosity > level) and (Logger.verbosity <= max_level+1) and (condition):
            sys.stdout.write(msg)
            sys.stdout.flush()

    @staticmethod        
    def log(msg, level, condition=True, max_level=10):
        if (Logger.verbosity > level) and (Logger.verbosity <= max_level+1) and (condition):
            sys.stdout.write(msg+"\n")
            sys.stdout.flush()

    @staticmethod        
    def error(msg):
        sys.stderr.write(msg+"\n")
        sys.stderr.flush()
            
    @staticmethod        
    def level(level):
        return Logger.verbosity > level

    @staticmethod        
    def start_timer(name):
        if not Logger.time:
            return None
        Logger.timers.append((time.time(), name))
        Logger.id_timer += 1
        return Logger.id_timer-1
    
    @staticmethod        
    def stop_timer(id_timer):
        if not Logger.time:
            return None
        diff = time.time() - Logger.timers[id_timer][0]
        sys.stdout.write("Timer \"%s\": %.2f sec\n"%(Logger.timers[id_timer][1], diff))
        sys.stdout.flush()
        return diff
