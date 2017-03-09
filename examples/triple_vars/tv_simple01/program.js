// Thread t1
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
var y = new Int8Array(data.y_sab); Atomics.store(y, 0, 1);
var z = new Int8Array(data.z_sab); Atomics.store(z, 0, 1);
$.agent.report(report);
$.agent.leaving();
})
`);
// Thread t2
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Int8Array(data.x_sab); id7_R_t2 = Atomics.load(x, 0); report.push("id7_R_t2: "+id7_R_t2);
var y = new Int8Array(data.y_sab); id8_R_t2 = Atomics.load(y, 0); report.push("id8_R_t2: "+id8_R_t2);
var z = new Int8Array(data.z_sab); id9_R_t2 = Atomics.load(z, 0); report.push("id9_R_t2: "+id9_R_t2);
$.agent.report(report);
$.agent.leaving();
})
`);
var data = {
x_sab : new SharedArrayBuffer(8),
y_sab : new SharedArrayBuffer(8),
z_sab : new SharedArrayBuffer(8),
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
ex[0] = "id7_R_t2: 1;id8_R_t2: 0;id9_R_t2: 1"
ex[1] = "id7_R_t2: 1;id8_R_t2: 0;id9_R_t2: 0"
ex[2] = "id7_R_t2: 1;id8_R_t2: 1;id9_R_t2: 0"
ex[3] = "id7_R_t2: 1;id8_R_t2: 1;id9_R_t2: 1"
ex[4] = "id7_R_t2: 0;id8_R_t2: 0;id9_R_t2: 0"
ex[5] = "id7_R_t2: 0;id8_R_t2: 0;id9_R_t2: 1"
ex[6] = "id7_R_t2: 0;id8_R_t2: 1;id9_R_t2: 1"
ex[7] = "id7_R_t2: 0;id8_R_t2: 1;id9_R_t2: 0"
var ok = false;
for(var i=0; i < ex.length; i++){
if (res == ex[i]) {
ok = true;
}
}
assert(ok);
