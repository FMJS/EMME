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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = x[1]; report.push("id7_R_t3: "+id7_R_t3);
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
outputs[1] = "id6_R_t3: 1;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 256;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 257;id7_R_t3: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm8FugkAURff9CpZtYoIwDiRtuqhpTDdtE7twSZrQBUmtXeiq8d8LgjDVwVZhBq1nR94wT2G4x+s8
//nuvOFvPPxdx1nSQOonE0F9dO/yaJw/Wx605n8dt7esLD0Ll1vi6T2I8m0dzrpTPE6uiq56TRQXbsZ1G5
//Osqjec4smmfMo156xvQ1+cjivpJDjYua+EDJrsZlTTyo+dzi+yydu6d75/H5P17bKl5dkZq9ikptNNBm
//UPMKbV6hzSu0eYU2b3WvA21UPVdqz5Wb5+ZrPB6OVov8Y+XWdy2d2c9m1w16uwb9XYOiGAx3zQz1M4sv
//PioeTm1+/ex85sskm7m8cHUy95A5Mj8/mTdXcjVYLnzfvMg1n3qw9H0ZIH7Ez298E/GXC+zZFL9oQfwh
//4kf85yf+pj/uXUtffdjaBAL/98EBXqARK8pbYhUI6kKwB4D0kb51J9CN8PVOoDkOcALgACewx37hNivK
//i/dtAkHiBJA+0m+5GrCXE+hG+Hon0BwHVAgAAl7ggCJA10AQxoBA1QAgnCEQmhUGjtMfmIIE+wcgAs+w
//d7Gga0gMtI8mewrgAByYdgxHB4Pfaws4BhABIk6u12B7UAHM4Z0GG/EiJ+4A6SP94+g/aEP4f+4+OBgH
//VBwAAl7ASk9Cu0AQxoBAxQEg8Hai8T4Fc/7APCTYPwAReAYLvQvtQuKXV5XZUwAH4OB4+xlsOAZTiMAx
//gAgcg4Ueh3YhIXEM4AAcnGrfgw3HYAoRVCaABJ7BQi+EubqEDUhQrQASvO1ouD/Cdq3CPDjYjwAbeAvj
//PRPm6hfsUYAIEHHyfRS2axptYuMbc8+jVw==
