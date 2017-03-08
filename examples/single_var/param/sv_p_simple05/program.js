if (this.Worker) {
(function execution() {
var t1 =
`onmessage = function(data) {
for(i = 0; i <= 1; i++){
var x = new Float32Array(data.x_sab); x[i] = i+i;
}
};`;
var t2 =
`onmessage = function(data) {
var x = new Float64Array(data.x_sab); id3_R_t2 = x[0]; print("id3_R_t2: "+id3_R_t2.toFixed(2));
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
