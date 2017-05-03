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
      var x = new Int8Array(data.x_sab); x[1] = 1;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 257;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 257;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[9] = "id6_R_t2: 1;id7_R_t2: 256";
outputs[10] = "id6_R_t2: 256;id7_R_t2: 256";
outputs[11] = "id6_R_t2: 257;id7_R_t2: 256";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 258";
outputs[13] = "id6_R_t2: 1;id7_R_t2: 258";
outputs[14] = "id6_R_t2: 256;id7_R_t2: 258";
outputs[15] = "id6_R_t2: 257;id7_R_t2: 258";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQQmznG0tHTRUEI3bSFdZCkFsxCapguzKnn3ajSi5tiacbws/p2cOeNllA/5
//GSl3+/h7H0spotALVkGs7sT8Pgr907GU2124+UwanhfiQfxcR6EK1kHszJIZdDy6mYlK1WWrulQltpfY
//XpetZveaVrM7zapO0rH9iL7Suip1l+vUUHcb6rqh7jVcN7+fg3h8fRIvb1iz9mtWe3qPrZZ7ie0lttdl
//e122V7O9ut6bvePVYnl8yZUVPj1dMnOezm4adPJBnxtUfw3S6fLL/BNjz8/Pzma+r9OZhyvJIeAAASAA
//BGwh4JwhUCzzvH8CmKsaw6C0BxpAA2jo7/+gWE5nSBrIAg0+aAANoKETDWc/BkPBoNgX3p2Fcp6ggAJQ
//AArj5Al0NlgsuOqQJtTq+TkvzBgAA2AADKNkDDZYaJ0wGGNRzR3ABbgAF6PkDna5oN648MEFuAAX42YR
//ZlgYJRHGVFTyCe2BClABKqay46FYWLKXUGizhAI0gAbQMJV9EJfDYJpRaNOMAmAADIAxld0RXcCg3sDw
//AQbAABjT2zPRhgsbOYU2zCluQQWoABUD5hSl5NJmSuGyXJhmFGABLICF4TIKqyj8l1B0paKeTwALYAEs
//hssnesKCesLCBxbAAliMkk10pOKSZKI9FL9V6GJY
