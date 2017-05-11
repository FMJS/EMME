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
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 0;
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
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 515;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 256";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 256";
outputs[7] = "id6_R_t2: 515;id7_R_t2: 256";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcI0czIpKC4sUtyoUBddBiEuAta6SFfSdzdpLqTpiaaTSTOFfxfOnMllEj7C
//z0i52Sbf20RKEUdBuAwTdSumd3E0K4+lXG+ij8+04Wku7sXPdRypcBUm3iSdQfujm4k4qPpsVdeqxPYS
//2+uz1fxes2p+p3nVSzvW7/FXVle17nqdWup+S1231IOW6xb3sxMPL4/i+RVr1n3NGk8fsNV6L7G9xPb6
//bK/P9mq2Vzd783e8nC/2L/lghcunS2dOs9ltg14xOOMG1V+DVF5+UXxi7Pn52fnMt1U2c3clOQQICAAB
//IGALAe8IgWqZp8MTwFzVGAbtKdAAGkDDcP8H1XJ656SBLNCgQQNoAA29aDj6MTgXDIp94f1ZQJ4AFICC
//A3kCHQ1WC656pAmNenFOZAyAATBcQsZgg4XOCYMxFsgdwAW4cCB3sMsFDcYFsghwAS5GziLMsDBKIoyp
//qOcTSgegAlSACld2PFQLS/YSCm2UUIAG0AAanNkHcToMphmFNswoAAbAABjO7I7oAwYNBoYGGAADYLi3
//Z6ILFzZyCo2cAlSAigvIKWrJpc2Uwme5QEYBFsCC+xmFVRT+Syj6UoF8AlgAi/HyiYGwoIGwQDYBLIDF
//ONlETypOSSa6Q/EL3x1iMA==
