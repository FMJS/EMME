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
      var x = new Int16Array(data.x_sab); id2_R_t1 = Atomics.load(x, 0); report.push("id2_R_t1: "+id2_R_t1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id5_R_t2 = Atomics.load(x, 0); report.push("id5_R_t2: "+id5_R_t2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
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
      if (reports >= 2) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id2_R_t1: 0;id5_R_t2: 0";
outputs[1] = "id2_R_t1: 1;id5_R_t2: 0";
outputs[2] = "id2_R_t1: 256;id5_R_t2: 0";
outputs[3] = "id2_R_t1: 257;id5_R_t2: 0";
outputs[4] = "id2_R_t1: 0;id5_R_t2: 2";
outputs[5] = "id2_R_t1: 1;id5_R_t2: 2";
outputs[6] = "id2_R_t1: 256;id5_R_t2: 2";
outputs[7] = "id2_R_t1: 257;id5_R_t2: 2";
outputs[8] = "id2_R_t1: 0;id5_R_t2: 512";
outputs[9] = "id2_R_t1: 1;id5_R_t2: 512";
outputs[10] = "id2_R_t1: 256;id5_R_t2: 512";
outputs[11] = "id2_R_t1: 257;id5_R_t2: 512";
outputs[12] = "id2_R_t1: 0;id5_R_t2: 514";
outputs[13] = "id2_R_t1: 1;id5_R_t2: 514";
outputs[14] = "id2_R_t1: 256;id5_R_t2: 514";
outputs[15] = "id2_R_t1: 257;id5_R_t2: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9rgzAYBvD7PkWOGwgxNjWwscPKKLtsg+7Qowy6g7CuO9jT6Hefzn+ppjNqXr08N3lNXtNEfpQH
//OT8ck+9jwjmLd0G0iRJxy/y7eLfMroP0mvP9YffxmQ54WrF79nNdjvPSGYtom17deOysKrVqPqJZzbtn
//1TCrBs2q0qr5iGZVpNf79/jLq9bdruur0+vyQj1/frseXnhusZ4Te3h5ZM+v2B3T7jR+vd6lrobGsXqH
//eqf0DnU1NI7VO0hjB2nsIJsd8jPerNZ/h3y2yvI3pzP9bPalm6K4WZ+jYabxpigfv269Ytoo8+x85tu2
//mGnzYhTbc7riJhwEcAAOwKE/DqKFQ9XUp6fBvJ39wPgfhmAZggbQABpc/G+oFiCmpEGR0aBAA2gADZY0
//tP4YTAVD96a5ZEHPGQKgABSAAnXO0L5ZHY8/ImVo1Iue3dmDRcYAGAADYCDOGFywYJ0wdGNhlTAABsAA
//GIgTBrcwKDIYFGAADIBhqnxhGAuD0oXBKOjpwlIABaAAFGb4jqE6BuEuX5AO8wXQABpAwwxfMfSHYWjC
//IAcmDKABNICGGb5iGEODIqNBgQbQABrm/IrBBgYXKYMcmDJIoAAUgAJJyqAljC4zhoXxVXKbMIAFsAAW
//KBIGpyh05QvWVFimC2ABLIAFinSBiAVFxIICC2ABLBAnCyNR6JMr2JPwCzmMM5A=
