// Thread t1
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Int8Array(data.x_sab); x[0] = 0;
var x = new Int8Array(data.x_sab); x[1] = 0;
$.agent.report(report);
$.agent.leaving();
})
`);
// Thread t2
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Int8Array(data.x_sab); x[1] = 2;
var x = new Int8Array(data.x_sab); x[2] = 2;
$.agent.report(report);
$.agent.leaving();
})
`);
// Thread t3
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
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
if (reports >= 3) break;
}
}
res.sort();
res = res.join(";");
var ex = [];
ex[0] = "id6_R_t3: 0"
ex[1] = "id6_R_t3: 131072"
ex[2] = "id6_R_t3: 512"
ex[3] = "id6_R_t3: 131584"
var ok = false;
for(var i=0; i < ex.length; i++){
if (res == ex[i]) {
ok = true;
}
}
assert(ok);
