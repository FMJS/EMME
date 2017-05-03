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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 3;
      var x = new Int8Array(data.x_sab); x[3] = 3;
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
outputs[1] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[3] = "id6_R_t2: 768;id7_R_t2: 3";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[5] = "id6_R_t2: 768;id7_R_t2: 768";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 771";
outputs[7] = "id6_R_t2: 768;id7_R_t2: 771";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcIkObmI4sIixY0KddFlEOIiYK2LdCV9d5PmQi4nmk4mSVv/XTlzJpdJ+cj8
//RMrNNvraRlKKMHD9pR9ZN8K4DQMv/y3lehO8f8QNj3NxJ74vw8DyV35kzuIZtP91NROVqs1WnVKV2F5i
//e222ml5rUk2vNK2accf6LfxM6lapu1ynlrrdUnda6m7LebPr2Yn75wfx9II1675mtbt32Wq5l9heYntt
//ttdmex2216n3ps94OV/sH3JlhfO7i2cayey2QTMb9LhB67dByk+/yP5i7PH52enM11Uyc3chgQAQAAKD
//ImA2ECiW2RieAOasyjB47jVoAA2gYbj3g2I5zTFpINAAGkDD5DQ0XgzGgsFiH3h/FspbCQIKQAEoTJMn
//UGOwWHCrR5pQq2fHBAyAATCcQsagg4XOCYMyFtXNBbgAF+BiktxBLxcELsAFuDjXLEINC6UkQss2JGYD
//VIAKUHEsXzwUC0v6EgoHNIAG0HDa30EcDoNqRuEobjoABsAAGEfzdUQfMAhgAAyA8Z++mejChY6cQnEz
//4pmgAlSAihFzilJyqTOlsFkuwAJYAAvHn1FoReGvhKIvFbXtBrAAFsBixHxiICwIWAALYHFW2URPKg5J
//JrpD8QMc0WK0
