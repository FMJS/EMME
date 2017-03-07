if (this.Worker) {
(function execution() {
var t1 =
`onmessage = function(data) {
var x = new Int8Array(data.x_sab); x[0] = 1;
var x = new Int8Array(data.x_sab); x[1] = 1;
var x = new Int8Array(data.x_sab); x[0] = 2;
var x = new Int8Array(data.x_sab); x[1] = 2;
};`;
var t2 =
`onmessage = function(data) {
var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; print("id6_R_t2: "+id6_R_t2);
if(id6_R_t2 == 2) {
var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; print("id7_R_t2: "+id7_R_t2);
} else {
var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; print("id8_R_t2: "+id8_R_t2);
}
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
