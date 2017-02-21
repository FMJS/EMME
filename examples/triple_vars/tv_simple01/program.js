if (this.Worker) {
(function execution() {
var t1 =
`onmessage = function(data) {
var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
var y = new Int8Array(data.y_sab); Atomics.store(y, 0, 1);
var z = new Int8Array(data.z_sab); Atomics.store(z, 0, 1);
};`;
var t2 =
`onmessage = function(data) {
var x = new Int8Array(data.x_sab); id7_R_t2 = Atomics.load(x, 0); print("id7_R_t2: "+id7_R_t2);
var y = new Int8Array(data.y_sab); id8_R_t2 = Atomics.load(y, 0); print("id8_R_t2: "+id8_R_t2);
var z = new Int8Array(data.z_sab); id9_R_t2 = Atomics.load(z, 0); print("id9_R_t2: "+id9_R_t2);
};`;
var data = {
x_sab : new SharedArrayBuffer(8),
z_sab : new SharedArrayBuffer(8),
y_sab : new SharedArrayBuffer(8),
}
 
 
 
var wt1 = new Worker(t1);
var wt2 = new Worker(t2);
wt1.postMessage(data, [data.x_sab, data.z_sab, data.y_sab]);
wt2.postMessage(data, [data.x_sab, data.z_sab, data.y_sab]);
})();
}
