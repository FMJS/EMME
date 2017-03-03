if (this.Worker) {
(function execution() {
var t1 =
`onmessage = function(data) {
var x = new Int16Array(data.x_sab); id2_R_t1 = x[0]; print("id2_R_t1: "+id2_R_t1);
var x = new Int8Array(data.x_sab); x[0] = 1;
var x = new Int8Array(data.x_sab); x[1] = 1;
};`;
var t2 =
`onmessage = function(data) {
var x = new Int16Array(data.x_sab); id5_R_t2 = x[0]; print("id5_R_t2: "+id5_R_t2);
var x = new Int8Array(data.x_sab); x[0] = 2;
var x = new Int8Array(data.x_sab); x[1] = 2;
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
