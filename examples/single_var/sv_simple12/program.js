if (this.Worker) {
(function execution() {
var t1 =
`onmessage = function(data) {
var x = new Float32Array(data.x_sab); x[0] = 1.10;
var x = new Float32Array(data.x_sab); x[1] = 1.10;
};`;
var t2 =
`onmessage = function(data) {
var x = new Float32Array(data.x_sab); x[1] = 2.20;
var x = new Float32Array(data.x_sab); x[2] = 2.20;
};`;
var t3 =
`onmessage = function(data) {
var x = new Float64Array(data.x_sab); id6_R_t3 = x[0]; print("id6_R_t3: "+id6_R_t3.toFixed(2));
var x = new Float32Array(data.x_sab); id7_R_t3 = x[0]; print("id7_R_t3: "+id7_R_t3.toFixed(2));
};`;
var data = {
x_sab : new SharedArrayBuffer(16),
}

var wt1 = new Worker(t1);
var wt2 = new Worker(t2);
var wt3 = new Worker(t3);
wt1.postMessage(data, [data.x_sab]);
wt2.postMessage(data, [data.x_sab]);
wt3.postMessage(data, [data.x_sab]);
})();
}
