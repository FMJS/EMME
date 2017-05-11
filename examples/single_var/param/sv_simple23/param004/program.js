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
      var x = new Float64Array(data.x_sab); id2_R_t1 = x[0]; report.push("id2_R_t1: "+id2_R_t1.toFixed(4));
      var x = new Float32Array(data.x_sab); x[0] = 0.0000;
      var x = new Float32Array(data.x_sab); x[1] = 0.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2.toFixed(4));
      var x = new Float32Array(data.x_sab); x[0] = 1.0000;
      var x = new Float32Array(data.x_sab); x[1] = 1.0000;
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
outputs[0] = "id2_R_t1: 0.0000;id5_R_t2: 0.0000";
outputs[1] = "id2_R_t1: 0.0078;id5_R_t2: 0.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtnE9vmzAYxu/7FBw3KSr/jD212qHVVO2yVmoPPUaVskOk/jukp6nffWQQ4oDtkNZQCL+covexDQbz
//06v3wYTh8+vq5XUVhsFykcxv5qv4NIhOovx3tlxk60CyCYTh4/Piz0Pe9NdF8CP4+3XTY5b3Ted3+b9v
//s2AnKrRo0aIeLQ6xjsp1NKlHlRYtWtSjcf7/8X75NKtm0IzrZ6fHhSVeHL8Zl5bjlufzFpxf/Qx+X3N1
//TFenNnt9lG1UGtvqI2yvlD7CNiqNbfURhHEEYRxB1Eco7vHNxeX/m7xzlps55z2jdW+bGLvExCWmLlG4
//xMwlSpeoSnG76gzzNIqxS0xcYuoShUvMXKJ0iWpzay8bj6/Wyty76Hl7V/Zs89CVS+/tSwiCQTAI9o7g
//jnFouF6RXYrtUmKXUtC7i17zIj0MyIAX8ALeI8t9m8iuJi3sUmaXyHqt6FUdold9B72gF/Qegt7u809v
//VJUA1wHc/YuQTBfcgtvBZLryE2oBZLj9FhcAMSAGxJQcjtlu64y8dbFa+ukHzLZavBxzvwUHfsEv+MVq
//G4zVNmDstjba9sMY7IJdsIvRNqAyxCjAqzoELzYb4AW82GwTxO27artkucAW2GKykd12UVYAw2AYDFNs
//mOyOtiZ3q4Uq7FJml5Q/e01gr4Fe0Iu9dlw72T4Pue+11gTZLsgFuVhr433DdwjQVR1CF1sN6AJdbLWJ
//odZHLZfsFtACWiw1str+dqyBYBAMgrHTvNtp1XqJ7FJslxLXmwaeWSu9mmip8dHEQgO34BYLzbeFNjHM
//7jPOWsMXzIJZMItt1rrAMFnQqs5Ai1UGaAEtVtkk8HpIdZYsFrgCV+wxstdeTTGwC3bBLpbYeHeYyR45
//rbx/vhHLDByDYyyz0e86GySGP/g5R7JiMAyGsdRG9c7uwEGsegcxlhsgBsRYbpPCr8fvjJEFA1/giyVH
//9juM/WrtsfwPY69rsA==
