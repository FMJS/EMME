if (this.Worker) {
(function execution() {
var t1 =
`onmessage = function(data) {
var x = new Int8Array(data.x_sab); x[0] = 1;
var x = new Int8Array(data.x_sab); x[1] = 1;
var x = new Int8Array(data.x_sab); x[2] = 1;
};`;
var t2 =
`onmessage = function(data) {
var x = new Int8Array(data.x_sab); x[1] = 2;
var x = new Int8Array(data.x_sab); x[2] = 2;
var x = new Int8Array(data.x_sab); x[3] = 2;
};`;
var t3 =
`onmessage = function(data) {
var x = new Int32Array(data.x_sab); id8_R_t3 = x[0]; print("id8_R_t3: "+id8_R_t3);
var x = new Int16Array(data.x_sab); id9_R_t3 = x[1]; print("id9_R_t3: "+id9_R_t3);
};`;
var data = {
x_sab : new SharedArrayBuffer(8),
}
 
var wt1 = new Worker(t1);
var wt2 = new Worker(t2);
var wt3 = new Worker(t3);
wt1.postMessage(data, [data.x_sab]);
wt2.postMessage(data, [data.x_sab]);
wt3.postMessage(data, [data.x_sab]);
})();
}