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
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 == 1) {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; report.push("id8_R_t2: "+id8_R_t2);
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
outputs[0] = "id6_R_t2: 0;id8_R_t2: 0";
outputs[1] = "id6_R_t2: 2;id8_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id8_R_t2: 2";
outputs[3] = "id6_R_t2: 2;id8_R_t2: 2";
outputs[4] = "id6_R_t2: 0;id8_R_t2: 1";
outputs[5] = "id6_R_t2: 2;id8_R_t2: 1";
outputs[6] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[7] = "id6_R_t2: 1;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 1;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmDtrwzAUhff+Co0JBBS9rNKSIaE1HfoApyWjKXUHQxN3cKbS/17bslPFXGHHFiTD3cTxufbVlT4O
//mNJsn3/vc0pJmgRxFOf8hsxv0+S6WVO6zZLPr8LwsCIL8jNJEx5v4pzNigpRraYzcqRKUFWWKkCvAL0S
//VE2vpWo6NSorHNv3dFfq3HLbunDo0qErhx44vlv380uWz3fk6QVn1n9mrd0HoGp7BegVoFeCXgl6FehV
//ba8542gVVod8NOFmd0XlvKyeNEWth6x5SVhfFPAVcLWpXG/KSrOuxvqR7ZJFuHxc30+vKMQ3R76Rb+R7
//FN+HSQ6l2z4Kj2zb2c2RbWQb2fab3YdxDkjuutZHbiPbyDay7TW3+5ANp/ZIru3MZsg1co1c+81sNSKz
//lb/MRraRbWTba2arwZk9kmtWcK0v/B/auW7j/+i1447qi+X6XDPjHfQFnfTBnPU+i1YXGuxCg11osAvd
//ybVsc63hOHeSbQ9cn/YP7TV664M2R7QRbUTbJ9pWmp8INu+O7J5YM8QasUasfWItB2Mte2L9B9OxL0o=
