if (this.Worker) {
(function execution() {
var t1 =
`onmessage = function(data) {
var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
};`;
var t2 =
`onmessage = function(data) {
var x = new Int8Array(data.x_sab); id3_R_t2 = Atomics.load(x, 0); print("id3_R_t2: "+id3_R_t2);
};`;
var data = {
x_sab : new SharedArrayBuffer(8),
}
 
var wt1 = new Worker(t1);
var wt2 = new Worker(t2);
wt1.postMessage(data, [data.x_sab]);
wt2.postMessage(data, [data.x_sab]);
})();
}
