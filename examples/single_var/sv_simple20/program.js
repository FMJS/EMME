// Thread t1
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Int8Array(data.x_sab); x[0] = 1;
var x = new Int8Array(data.x_sab); x[1] = 1;
var x = new Int8Array(data.x_sab); x[2] = 1;
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
var x = new Int8Array(data.x_sab); x[3] = 2;
$.agent.report(report);
$.agent.leaving();
})
`);
// Thread t3
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Int32Array(data.x_sab); id8_R_t3 = x[0]; report.push("id8_R_t3: "+id8_R_t3);
var x = new Int16Array(data.x_sab); id9_R_t3 = x[1]; report.push("id9_R_t3: "+id9_R_t3);
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
ex[0] = "id8_R_t3: 33620481;id9_R_t3: 513"
ex[1] = "id8_R_t3: 512;id9_R_t3: 1"
ex[2] = "id8_R_t3: 512;id9_R_t3: 0"
ex[3] = "id8_R_t3: 512;id9_R_t3: 2"
ex[4] = "id8_R_t3: 513;id9_R_t3: 0"
ex[5] = "id8_R_t3: 513;id9_R_t3: 1"
ex[6] = "id8_R_t3: 513;id9_R_t3: 2"
ex[7] = "id8_R_t3: 131584;id9_R_t3: 2"
ex[8] = "id8_R_t3: 257;id9_R_t3: 2"
ex[9] = "id8_R_t3: 257;id9_R_t3: 1"
ex[10] = "id8_R_t3: 131584;id9_R_t3: 1"
ex[11] = "id8_R_t3: 0;id9_R_t3: 2"
ex[12] = "id8_R_t3: 0;id9_R_t3: 1"
ex[13] = "id8_R_t3: 0;id9_R_t3: 0"
ex[14] = "id8_R_t3: 131329;id9_R_t3: 2"
ex[15] = "id8_R_t3: 131329;id9_R_t3: 1"
ex[16] = "id8_R_t3: 66049;id9_R_t3: 514"
ex[17] = "id8_R_t3: 0;id9_R_t3: 513"
ex[18] = "id8_R_t3: 131585;id9_R_t3: 513"
ex[19] = "id8_R_t3: 131329;id9_R_t3: 514"
ex[20] = "id8_R_t3: 0;id9_R_t3: 514"
ex[21] = "id8_R_t3: 131329;id9_R_t3: 513"
ex[22] = "id8_R_t3: 131584;id9_R_t3: 513"
ex[23] = "id8_R_t3: 65793;id9_R_t3: 1"
ex[24] = "id8_R_t3: 131585;id9_R_t3: 2"
ex[25] = "id8_R_t3: 1;id9_R_t3: 0"
ex[26] = "id8_R_t3: 1;id9_R_t3: 1"
ex[27] = "id8_R_t3: 1;id9_R_t3: 2"
ex[28] = "id8_R_t3: 33686016;id9_R_t3: 513"
ex[29] = "id8_R_t3: 33686016;id9_R_t3: 514"
ex[30] = "id8_R_t3: 131584;id9_R_t3: 514"
ex[31] = "id8_R_t3: 512;id9_R_t3: 513"
ex[32] = "id8_R_t3: 131585;id9_R_t3: 1"
ex[33] = "id8_R_t3: 66049;id9_R_t3: 513"
ex[34] = "id8_R_t3: 65793;id9_R_t3: 2"
ex[35] = "id8_R_t3: 513;id9_R_t3: 514"
ex[36] = "id8_R_t3: 33620225;id9_R_t3: 513"
ex[37] = "id8_R_t3: 33620225;id9_R_t3: 514"
ex[38] = "id8_R_t3: 513;id9_R_t3: 513"
ex[39] = "id8_R_t3: 257;id9_R_t3: 513"
ex[40] = "id8_R_t3: 131585;id9_R_t3: 514"
ex[41] = "id8_R_t3: 257;id9_R_t3: 0"
ex[42] = "id8_R_t3: 257;id9_R_t3: 514"
ex[43] = "id8_R_t3: 66049;id9_R_t3: 2"
ex[44] = "id8_R_t3: 66049;id9_R_t3: 1"
ex[45] = "id8_R_t3: 33620481;id9_R_t3: 514"
ex[46] = "id8_R_t3: 33685761;id9_R_t3: 513"
ex[47] = "id8_R_t3: 512;id9_R_t3: 514"
ex[48] = "id8_R_t3: 33685761;id9_R_t3: 514"
ex[49] = "id8_R_t3: 33686017;id9_R_t3: 514"
ex[50] = "id8_R_t3: 65793;id9_R_t3: 514"
ex[51] = "id8_R_t3: 1;id9_R_t3: 514"
ex[52] = "id8_R_t3: 1;id9_R_t3: 513"
ex[53] = "id8_R_t3: 65793;id9_R_t3: 513"
ex[54] = "id8_R_t3: 33686017;id9_R_t3: 513"
var ok = false;
for(var i=0; i < ex.length; i++){
if (res == ex[i]) {
ok = true;
}
}
assert(ok);
