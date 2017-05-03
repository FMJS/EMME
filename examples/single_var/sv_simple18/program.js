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
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 3;
      var x = new Int8Array(data.x_sab); x[3] = 4;
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
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 513;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 3";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 3";
outputs[7] = "id6_R_t2: 513;id7_R_t2: 3";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 1024";
outputs[9] = "id6_R_t2: 1;id7_R_t2: 1024";
outputs[10] = "id6_R_t2: 512;id7_R_t2: 1024";
outputs[11] = "id6_R_t2: 513;id7_R_t2: 1024";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 1027";
outputs[13] = "id6_R_t2: 1;id7_R_t2: 1027";
outputs[14] = "id6_R_t2: 512;id7_R_t2: 1027";
outputs[15] = "id6_R_t2: 513;id7_R_t2: 1027";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2rtqwzAUBuC9T+GxhYAsHSuBlg4NJXRpC+mQ0RTcwdA0HZyp5N1rxxeU+Lh1ZPky/Js5OvJFNh/m
//R0Ls9sn3PhHCi6N5uA4Tdev5d3G0KI+F2O6ij8+04Wnp3Xs/13Gkwk2YyFk6g45HNzPvpBqwVW1Uie0l
//tjdgq/m9ZtX8TvOqTDu27/FXVldGt1mnhnrQUNcN9XnDdYv7OXgPL4/e8yvWrP2anT39nK2avcT2Etsb
//sL0B26vZXn3em7/j9XJ1fMknK1w+XTrTz2Y3DcpicMENqr8Gqbz8qvjE2PPzs/OZb5ts5uFKcAhIIAAE
//gIArBGQNgWqZ/f4JYK5qDYOWCjSABtDQ3/9BtZxySBrIAQ0EGkADaOhEQ+3HYCgYFPvCu7Ng5gkEFIAC
//UBgnT6DaYLXgqkOacFYvznlhxgAYAANgGCVjcMFC64TBGovT3AFcgAtwMUru4JYL6o0LAhfgAlyMm0XY
//YWGVRFhTYeYT0lcBrIAVsGIqWx6qhSV3EYW2iihgA2yADdPZCXG5DLYphbZMKSAGxIAY09kg0UUM6k0M
//ghgQA2JMcN9EGy9cZBXaNqtYwApYASsGzCqM+NJlUhGwXljnFHABLsCF4XIKpyr8l1J0taKWUUALaAEt
//hssoetKCetKCoAW0gBbj5BMdrbgknWgvxS9hgmOI
