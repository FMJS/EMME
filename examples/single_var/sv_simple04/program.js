// Thread t1
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Int16Array(data.x_sab); Atomics.store(x, 0, 1);
$.agent.report(report);
$.agent.leaving();
})
`);
// Thread t2
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Int16Array(data.x_sab); Atomics.store(x, 0, 2);
$.agent.report(report);
$.agent.leaving();
})
`);
// Thread t3
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Int16Array(data.x_sab); id4_R_t3 = Atomics.load(x, 0); report.push("id4_R_t3: "+id4_R_t3);
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
ex[0] = "id4_R_t3: 2"
ex[1] = "id4_R_t3: 1"
ex[2] = "id4_R_t3: 0"
var ok = false;
for(var i=0; i < ex.length; i++){
if (res == ex[i]) {
ok = true;
}
}
assert(ok);
