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
      var x = new Float32Array(data.x_sab); x[0] = 1.0000;
      var x = new Float32Array(data.x_sab); x[1] = 1.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2.toFixed(4));
      var x = new Float32Array(data.x_sab); x[0] = 2.0000;
      var x = new Float32Array(data.x_sab); x[1] = 2.0000;
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
outputs[1] = "id2_R_t1: 2.0000;id5_R_t2: 0.0000";
outputs[2] = "id2_R_t1: 0.0000;id5_R_t2: 0.0078";
outputs[3] = "id2_R_t1: 2.0000;id5_R_t2: 0.0078";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtnL1u2zAUhfc+hcYWMKo/iiwSdGgQBFnSAumQ0QjgDgbipIMzBXn3yJFs0RJJ/0kyZX+ejHtISpSo
//D8Q9ugrDl9f5/9d5GAbTSTK+H8/jiyD6HuW/y+kkWwSSZSAMZy+Tf09509ur4Gfw9nXZY5T3TccP+b9v
//o2AtKrRo0aIeLQ6xiMpFNKlHlRYtWtSjcf5/9jh9Hq1m0IzrZ6fHhSVeHL8Zl5bjlufzHvz6fR3c/eHq
//mK5Obfb6KFVUGtvqI1RXSh+hikpjW30EYRxBGEcQ9RGKe3x/dfN5k9fOcjnnvGe06G0TY5eYuMTUJQqX
//mLlE6RJVKVarzjBPoxi7xMQlpi5RuMTMJUqXqJa39qbx+GqtzL2Lnn8fyp7bPHTl0nv/EoJgEAyCW0dw
//xzg0XK/ILsV2KbFLKehdR695ke4GZDd4E8ALeAHv0Pa+TWSvJi3sUmaX2PVa0atAL+gFvd6gt/v9Z2tU
//lQDXAdzNixDcgltw681OVx4hF8AOt9/kQvcgJtcLiAExdtvx7LbOyFsXV0s/PcBsq8XLMTdbcOAX/IJf
//rDZvrDaPsbu10bYZxqQfwC7YxWjzKA0xCPAqwAt4AS822+BtNq9wu1duF9gCW2CLycbutou0QvcYJscL
//hsEwFpunFW1N7q4WqrBLmV1S7dlrAnsN9IJe7LXTqmQ7HnL3tdYESQeQC3Kx1ob7hq8P0FVAF+gCXWy1
//065e6xO1beRyAS2gBbRYauxq+6tY2xvBxpyu+gGCQTAIxk6r1ktkl2K7lLjeNGiZtbJVEy01PpqdWGjg
//FtyC27O20M4Ms5uMs63hu0tiAcyCWTB75rbZ2YJWAVpAC2ixyjq1yk4er7tkZ4ErcAWu2GPsXns1xQ7F
//LmUOYBfsYokdr8JM9shp1frnG6k6A8fgGMts8FVnXmL4wM858q4uGAbDWGqDemfXcxArQAyIATGW24lW
//p3mC3xa/MwZ8gS/wxZJj9+tHvdr2WP4ArdNrzg==
