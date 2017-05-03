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
      var x = new Float32Array(data.x_sab); x[0] = 1.5000;
      var x = new Float32Array(data.x_sab); x[1] = 1.5000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[1] = 1.0000;
      var x = new Float32Array(data.x_sab); x[2] = 1.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3.toFixed(4));
      var x = new Float32Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3.toFixed(4));
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(16),
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0.0000;id7_R_t3: 0.0000";
outputs[1] = "id6_R_t3: 0.1250;id7_R_t3: 0.0000";
outputs[2] = "id6_R_t3: 0.0078;id7_R_t3: 0.0000";
outputs[3] = "id6_R_t3: 0.0000;id7_R_t3: 1.5000";
outputs[4] = "id6_R_t3: 0.1250;id7_R_t3: 1.5000";
outputs[5] = "id6_R_t3: 0.0078;id7_R_t3: 1.5000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmz1PwzAQhnd+RUaQqqaJYxuBGKhQxQJIMDBWSGWoBJShnRD/nXzRuO3ZobRJbOftFN3FLzm7ebiz
//e2G4WC0/V8swDOYzMX2cLtlFMBqO0s/lfCY3DGH4vpi9vqW33o6Dq+DrdD6Lp8/TZTRIx7L86mwQpNYk
//u44zK8+vCmuhnlkL2cIapXe8v8w/MnusaKh2prEnirpq5xq70Pzd8nm+g+v7m+DuwcfYtp49JiOi4xSk
//gqrLSV1O6nJSl5O61ayqupVV1ZXkvXL73mKNH8eTfJE31H5nLR05ykbrnJHJGZuczORMTE5ucgqTU5ZO
//aYpTmuKUpjglHWc5zZPyVSKfjB5djHx6Lkfu8/qehIAZYAaYtQOzhnlFTBezGWWiZsn+AjiADCADyKzK
//ynZZtQ4v0bu43iXdgBhrDGJRzAExQKxXEFuPG+mzm0jviutzoqPxSTiDrn0WDtkXwAVw2Zh9iRbZJt0r
//IAE2gA1g60FZuf4KJHoX17scQZv6RT82xOQ5IAaIoaxspqw8kE/CGXTRC9ckuJB9AVzIvjosK/uRe7UN
//Nmz0A2wAW6tl5V77+n+hnoOnlUAb0Aa0eXKG6fs+Wf3CAWfAGXDmYqbGWySeNyebHey4RUPeA9zl9iqi
//vkCwikhVr6yctArTnOVWRuoyUpeRuozU/R+IjXBFy9Nu7ir1uavU566SIvnerU6x+r+pttFp95UF1oA1
//YA3NTxZAra7piUYdkAakAWlOZWottEFZhTPWCM629tmAM+CspzjztSGqE4j9Y7sUGRkQBoRZnpF12xpl
//bXkJxAFxQFwvi86j//jDKsjRJ56H42yjMQo4A85QdHrVLmVR0dkUwpCRAWFAmP+NUw4Unc0gDkcDQBwQ
//148WKmtPOgE5QA6Q8/b809f9tMO7CgA2gA1gcyN767atyrFT0WOB7wd9+bYW
