// Copyright 2017 Cristian Mattarei
//
// Licensed under the modified BSD (3-clause BSD) License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Thread t1
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(8),
}
$262.agent.broadcast(data);
var report = [];

// MAIN Thread

var thread_report;
var reports = 0;
var i = 0;
while (true) {
   thread_report = $262.agent.getReport();
   if (thread_report != null) {
      for(i=0; i < thread_report.length; i++){
         report.push(thread_report[i]);
         print(thread_report[i]);
      }
      reports += 1;
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0;id7_R_t3: 0";
outputs[1] = "id6_R_t3: 2;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 512;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 514;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 131072;id7_R_t3: 0";
outputs[5] = "id6_R_t3: 131074;id7_R_t3: 0";
outputs[6] = "id6_R_t3: 131584;id7_R_t3: 0";
outputs[7] = "id6_R_t3: 131586;id7_R_t3: 0";
outputs[8] = "id6_R_t3: 0;id7_R_t3: 2";
outputs[9] = "id6_R_t3: 2;id7_R_t3: 2";
outputs[10] = "id6_R_t3: 512;id7_R_t3: 2";
outputs[11] = "id6_R_t3: 514;id7_R_t3: 2";
outputs[12] = "id6_R_t3: 131072;id7_R_t3: 2";
outputs[13] = "id6_R_t3: 131074;id7_R_t3: 2";
outputs[14] = "id6_R_t3: 131584;id7_R_t3: 2";
outputs[15] = "id6_R_t3: 131586;id7_R_t3: 2";
outputs[16] = "id6_R_t3: 0;id7_R_t3: 512";
outputs[17] = "id6_R_t3: 2;id7_R_t3: 512";
outputs[18] = "id6_R_t3: 512;id7_R_t3: 512";
outputs[19] = "id6_R_t3: 514;id7_R_t3: 512";
outputs[20] = "id6_R_t3: 131072;id7_R_t3: 512";
outputs[21] = "id6_R_t3: 131074;id7_R_t3: 512";
outputs[22] = "id6_R_t3: 131584;id7_R_t3: 512";
outputs[23] = "id6_R_t3: 131586;id7_R_t3: 512";
outputs[24] = "id6_R_t3: 0;id7_R_t3: 514";
outputs[25] = "id6_R_t3: 2;id7_R_t3: 514";
outputs[26] = "id6_R_t3: 512;id7_R_t3: 514";
outputs[27] = "id6_R_t3: 514;id7_R_t3: 514";
outputs[28] = "id6_R_t3: 131072;id7_R_t3: 514";
outputs[29] = "id6_R_t3: 131074;id7_R_t3: 514";
outputs[30] = "id6_R_t3: 131584;id7_R_t3: 514";
outputs[31] = "id6_R_t3: 131586;id7_R_t3: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtnU1v2kAQhu/9FT62UiRjr22qVj00qqJe2krpIUdUiRyQmqYHcqry38tXYIGFxN6ZWUOeG1rsJWDm
//yZvMvH7z/P5h+vdhmufZZNyMrkdT9yEbfJyMh0+P8/zufnz7e3bA18vsU/bv7WRcjm5G0+JidoZbPHp3
//kc1Wq/njcr5aLx4tV5d7zleXOy5Xi9kRd78mf+brpbeHv+4OrFfe7v56fWC9OfC6q5/nMfv8/Uv27cc5
//vrfF+uYd+btvVuvgahPcwd/XBfd1wX1dcF8X3HfzWTfBVf/YOnhsvXvs8hpfX14tLvLWlXv61GZnDuZn
//H3qyOPZkeexJt3pyeOw1h+HXXP3gV6svZ3D/8NnLM3/ezM98fJOHyrykzCnz11fm8ZW8eXJ94Qf6RR54
//1c6lXxcUP8XP7/io4l9f4MKy+J1A8VcUP8X/+oo/9pd76tL3v2yyQEANAATUQBQt1h+JKRL8C4EaoPgp
///gRqIE3ph9VAPBAKVwyGCAKYgCBo8Y/DfWCs33xpSYVapv7RBNQ/vYEITZCm+sOaQIQJ9XuYABPQBK27
//AqmZ4DSZ0MAEmPD6mBDXLOinSnBoBzgBJ1Jqh71/JKYmRRX8aqIdYAJMMNEOvSPC810HSU74ToQSRIAI
//ZIOWE2G/d+lhqbsPYWd9tWdLdwKlT+nTgVByJ0gU/ou9CZ1xsD2jCBAAAlpAybEgCwSnBoQKIAAE5ha1
//XQx6+sACEqgGIIFqMHA2yGLimTFmVANAAAh9djtYqAYtSOw5IOAEnEA4KDkgZElRazIB7QAT6EmouyIs
//tIMiJ7anHeEEnEA7qDgl9BoVRpxo4AScYAJS1z1h3b9AY8AO2HEujgq9tgYaA07AifNwWVh3O/TZ4Tsv
//6gJwAA4EhmEKhPdXj5j3wnXyXlD8FD+dDsNsiPal39V94TrOUYIEkIAeMEyMiEGCU0NCBRJAArOUKXIk
//pDSCBSZQDmAC5ZAoXSIGFO3Gq1EOIAEk9D5zQl45aGFiz4UBKSAF4sEwiSKGFbUmFdAPUIH+RJJ8Cnn9
//oEiK7SlJSAEp0A9mqRVSTQsjUjSQAlIwKWmfZaHby0BnQA/occ4JF1ItDnQGpIAU55t7odv50KfHtiOj
//AhyAA4kh6sg4MrEd48cID2V3dWNQ+BQ+3Q5JN4Zo2T/nxYiFwe48JTgAB+gASSeGEg6cEg4qcAAOmKVU
//cmEYaAN9RKAYQASKQc+BoQSJ8GA1igEcgIP+ui9MFYMOIgLOCygBJRANks4LJU7UekRAN0AE+hBargtT
//3aBGid1JSCgBJdANco4Lg+aECSUaKAElmIJUcVsk61mgLyAH5Dhpp4VBKwN9ASWgxAm7LJJ1OLTJQeYF
//0EBaJMu88Ggklnmx2pPMC4qf4u9v5kX70u+aefFyIHDnapCAHkiWeRGDBKeGBO7zAhKYnUySeSGlESww
//gXIAEyiHRJkXMaBodzN7lANIAAm9z7yQVw5amCDzAlIgHlJmXsSwotakAvoBKtCfSJJ5Ia8fFEnBvagh
//BfohUeaFVNPCiBTcixpSMCWZIPNCt5eBzoAe0OOcMy+kWhzoDEgBKc4380K386FPDzIvAAcSI1HmRYwf
//IzyU3dWNQeFT+HQ7jDIv5L0YsTDgDtbgAB2QKPNC3ocRjwPuAQMOmKVMkHlh5cFAMYAIEHGimRfy/gsU
//AzgAByeZeWHlvYhFBJkXUALRkC7zQt53IUIEdANEoA+RIPPCynMhQAnuSQ0l0A1JMi+s/BYilOCe1FCC
//KUjzzIu0Xgv0BeSAHKeaeWHls0BfQAkocZqZF2k9Fi8nx3+VanGh
