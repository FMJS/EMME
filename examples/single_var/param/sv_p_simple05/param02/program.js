// Thread t1
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
for(i = 0; i <= 1; i++){
var x = new Float32Array(data.x_sab); x[i] = i+1;
}
$.agent.report(report);
$.agent.leaving();
})
`);
// Thread t2
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Float64Array(data.x_sab); id3_R_t2 = x[0]; report.push("id3_R_t2: "+id3_R_t2.toFixed(2));
$.agent.report(report);
$.agent.leaving();
})
`);
var data = {
x_sab : new SharedArrayBuffer(8),
}

$.agent.broadcast(data);
var res = [];
var report;
var reports = 0;
while (true) {
report = $.agent.getReport();
if (report != null) {
for(var i=0; i < report.length; i++){
res.push(report[i]);
print(report[i]);
}
reports += 1;
if (reports >= 2) break;
}
}
res.sort();
res = res.join(";");
var ex = [];
ex[0] = "id3_R_t2: 0.00"
ex[1] = "id3_R_t2: 2.00"
var ok = false;
for(var i=0; i < ex.length; i++){
if (res == ex[i]) {
ok = true;
}
}
assert(ok);
