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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[0] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2);
      var x = new Int8Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      if(id4_R_t2 > id5_R_t2) {
         var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      }
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
outputs[0] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 1;id5_R_t2: 1;id7_R_t2: 0";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 1";
outputs[4] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 1";
outputs[5] = "id4_R_t2: 1;id5_R_t2: 1;id7_R_t2: 1";
outputs[6] = "id4_R_t2: 1;id5_R_t2: 0;id6_R_t2: 0";
outputs[7] = "id4_R_t2: 1;id5_R_t2: 0;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm0tvgkAUhff9FSw1MUG8gkkbF5rWdNFHom1ckqZ0QVK1C1w1/e/lZR3tkPK4Y8fh7CYXOcCVL/dw
//Ara92UYf28i2rTAY+nM/Glxa/aswcIX1aLe27dUmeHuPf3w7tcbWZycMBv7Sj5xevDelq27P6uyUkmqm
//c1wdCVVXWnVitdVLuE7qA0FZrFNBfVig4xbU8+N+WZOHa+v+0bwrS+v76xlKq660KiqQVIGkCnSskHV3
//Pp2l7T3o2e6M4z37yd4HrZNsHMk35keY5f+fVL9IWq6aKS6WiWK2Tvv7ulkH49nkbnHTvbD/AsgBQADo
//PwH6aRE3PmLvGeFxAA/gOSE8v/hgREfsMMABOEaBQwrBoVOCA7sGcLSxa6TKrhGmDuAx2q6RGrsGcACO
//2XaN1Ng1Um/XxHjaATgAR6t4WphVbOF0rsn9rAN4AI9O0XQTdOQxQUNwHIADcLSPpctgUyWUBjSAxvhI
//ugw0dDpoYNEAzTnE0U0sGmHaAJx2RtH1LRqgATQtjaHrWzRSbdEQQQMafSNoUhBBE55vAI/5ETSxR9AE
//qwZwTI+giTmCBjSAxvgImpgjaFg0QNOCCJrYI2hMG4BjfARNzBE0oAE0xkfQxBxBM0KT2DWP6fMB1bfL
///qie9Nb1CjS8xtCovrIqN3yVW7thx47OwpMez2syaSTuzWP58ubQunnVPiF4mj+DHbCjAzuklB3Sgh0H
//7IAdjeZO/ddsisgp8c4AuAE3Zz5z6r9pA27ATXvnDbHPGwI34Mb4eUPs86YsN985GXcV
