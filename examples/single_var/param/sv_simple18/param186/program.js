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
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 2;
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
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 770;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 770;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[9] = "id6_R_t2: 2;id7_R_t2: 256";
outputs[10] = "id6_R_t2: 768;id7_R_t2: 256";
outputs[11] = "id6_R_t2: 770;id7_R_t2: 256";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 258";
outputs[13] = "id6_R_t2: 2;id7_R_t2: 258";
outputs[14] = "id6_R_t2: 768;id7_R_t2: 258";
outputs[15] = "id6_R_t2: 770;id7_R_t2: 258";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rgzAYB/D7PkWOGxRSE2PKxg4ro+yyDbpDjzJwB2Fdd7Cn0e8+rVbUPm42iS+H/608eeJLLD/0
//Tzjf7ZPvfcI5i6MgXIeJuGXzuzjSp9+cb3fRx2fa8LRk9+znOo5EuAkTb5bOkMdfNzNWq/pkVVWqkuyV
//ZK9PVvNrzar5leZVL+3YvsdfWV1Uuqt12VL3W+qqpR60nLe4ngN7eHlkz69Ys+5r1rj7gKxWeyXZK8le
//n+z1yV5F9qpmb/6M18vV8SHXVvh0d+nMeTa7bdArBjU1KP4alKfTr4q/GHl8enY+822TzTxccQoBAQSA
//ABBwhYB3hkC5zPP+CSDOagyDDhagATSAhv7eD8rl9IakQdrToPHpABpAgx0NZy8GQ8EgyAduz0IVBQEU
//gAJQGCdPkGeD5YILizShUS+OeWHGABgAA2AYJWNwwULnhMEYi3ruAC7ABbgYJXdwy4XsiwuNzw5wAS5G
//ziLMsDBKIoypqEGhAlABKkDFVHY8lAsr3SUUyiyhAA2gATRMZR/E5TCYZhTKNKMAGAADYExld4QNGLIv
//MDQ+PgAGwJjgnokuXLjIKZRhTrEAFaACVAyYU1SSS5cphU9yYZpRgAWwABaGyyicovBfQmFLRTOfABbA
//AlgMl0/0hIXsBwuNDw5gASzGySYsqbgkmegOxS8Qj2J8
