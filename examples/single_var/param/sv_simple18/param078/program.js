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
      var x = new Int8Array(data.x_sab); x[0] = 3;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      var x = new Int8Array(data.x_sab); x[3] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = x[1]; report.push("id7_R_t2: "+id7_R_t2);
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
outputs[0] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[3] = "id6_R_t2: 3;id7_R_t2: 1";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 256";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 257";
outputs[7] = "id6_R_t2: 3;id7_R_t2: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1Lw0AQBuC7v2KPCoXt7mRTUDxYpHhRoR56DEJ6CFjrIT1J/7tJ80HaTjTdbD6E91ZmZ5t0Ux6G
//l0i53cVfu1hKEYV+sAxifSumd1E4Kz5LudmG64+k4Wku7sX3dRTqYBXEapLsoMOnm4k4qnps1VSqxPYS
//2+ux1exe02p2p1lVJR2b9+gzretKd7VONXWvpm5q6n7NdfP72YuHl0fx/Ioza35mJ7/eZ6vVXmJ7ie31
//2F6P7TVsrzntzZ7xcr44POSjEy5+XbJzmu6uW1T54oxb1L8tUnH5Rf4XY7+f353tfFulO/dXkkOAgAAQ
//AAKuEFBnCJTHPO2eAOaq1jBgOgAMgKHD6aA8TtUnDNQaBkwMgAEwtIPhbCjoiwXNPnByOi0ooAAUgMIw
//WQKdLZYHrlskCSf1/DsvnBYAA2AADIPkCy5YaJwuWGOBKQJYAIvBMwe3WFBHWGCyABbAYuAcwo4KqxTC
//yVShjQ8qQAWoGMubDuXBkrt0wljNEKABNICG0bz/cDkMtvmEwSQBLsDF/34rog0X1BEXmC7ABbgY4bsS
//TbBwkVHYThYzUAEqQEWPGUUltXSZUHgsF7YTBFgAC2Chv3zCKQp/pRNtqcAEASpAxVDZREdUUCdUYKoA
//FaBimFyiJRSXpBLNmfgBDode+A==
