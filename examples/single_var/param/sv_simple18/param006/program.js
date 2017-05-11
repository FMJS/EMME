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
      var x = new Int8Array(data.x_sab); x[1] = 0;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[3] = "id6_R_t2: 1;id7_R_t2: 256";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rg0AQBuB7f8UeWwis7rgGWnpoKKGXtpAecpSCOQhN04M5lfz3avzA6NgaXaOW9xZmZ6NZw8Pw
//opS7ffi1D6UUge96Ky9Ut8K6C/x59lnK7c7ffEQNTwtxL76vA195ay+0Z9EOOn66mYmTqsNWdaFKbC+x
//vQ5bTe41riZ3mlTtqGP7HnzGdVXoLtappu7U1HVN3a25bno/B/Hw8iieX3Fmzc+s9OtdtlrsJbaX2F6H
//7XXYXs326nJv8oxXi+XxIZ+ccPbrop1WvLtu0U4X59yi+m2Rsssv078Y+/387mTn2zreebiSHAI2EAAC
//QMAUAnYFgfyYrf4JYK7aGgZMB4ABMPQ4HeTHaV8SBuoMAyYGwAAYusFQGQouxYJiHzhhWgAKQOE/ZAlU
//WcwPXHVIEkr19DsxLQAGwDCFfMEEC43ThdZYYIoAFsBi8MzBLBbUExaYLIAFsBg4h2hHRasUwshUobQL
//KkAFqBjLmw75wZK5dEK3miFAA2gADaN5/+F8GNrmExqTBLgAF9N+K6ILF9QTF5guwAW4GOG7Ek2wMJFR
//YLIAFaBiChlFIbU0mVA4LBeYIMACWBh/PmEUhb/Sia5UYIIAFaBiqGyiJyqoFyowVYAKUDFMLtERinNS
//ieZM/AAlil7g
