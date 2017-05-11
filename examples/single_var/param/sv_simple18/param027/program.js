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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      var x = new Int8Array(data.x_sab); x[3] = 2;
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
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 258;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 512";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 512";
outputs[7] = "id6_R_t2: 258;id7_R_t2: 512";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQQmznFMaOmioYRu2kK6yFIKdiE0TRdmVfLu1XjB6LE14xgN/Ds5c8bLKB/y
//M1Jud9H3LpJShIHnr/xI3YrpXRjM8mMpN9vg4zNueFqIe/FzHQbKX/uRM4ln0OHoZiKOqi5b1aUqsb3E
//9rpsNb3XpJreaVp14o7Ne/iV1FWpu1ynhrrbUNcNda/hutn97MXDy6N4fsWatV+zytN7bLXcS2wvsb0u
//2+uyvZrt1dXe9B2vFsvDSz5a4fzp4pnTZHbToJMNzrhB9dcg5ZdfZp8Ye35+djrzbZ3M3F9JDgEFBIAA
//ELCFgFNDoFjmaf8EMFc1h0F7oAE0gIb+/g+K5XTOSQNZoGEOGkADaOhEQ+3H4FwwKPaFd2cBeQJQAAoj
//yBOoNlgsuOqQJlTq2TmRMQAGwHAJGYMNFlonDOZYIHcAF+Bi+NzBLhfUGxfIIsAFuBg4izDDwiiJMKai
//nE9oR4EKUAEqxrLjoVhYspdQaKOEAjSABtAwmn0Qp8NgmlFow4wCYAAMgDGa3RFdwKDewJgDDIABMMa3
//Z6INFzZyCo2cAlSAigvIKUrJpc2UwmW5QEYBFsDC+DMKqyj8l1B0pgL5BLAAFoPlEz1hQT1hgWwCWACL
//YbKJjlSckky0h+IXydRiKA==
