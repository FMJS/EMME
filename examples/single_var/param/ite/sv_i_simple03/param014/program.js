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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2);
      var x = new Int8Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      if(id4_R_t2 <= id5_R_t2) {
         var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
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
outputs[0] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 2";
outputs[2] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 0";
outputs[4] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 0";
outputs[5] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 2";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 2";
outputs[7] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmk9vgjAYxu/7FBw1MUH7CiZbPGg2s8P+JLrFI1nGDiRTd8DTsu8+BJyVlQ1oi1333JoXeLCFX563
//j7juZhu/bWPXdaJwGMyDmJ077CIKvXzcT8aj/dh1V5vw5TU5+XrqjJ33ThSyYBnEg15yNaWjbs/p7JV2
//1UynWB1xVU9YHSRqq6dovaszTpmvU0l9WKLjldTz+344k7tL5/bevpml9cN8hsKqJ6zyCiRUIKECFRWy
//1Z1PZ+nyHq3Z1yr0d9ceLdx+MtzBkfhgrj/Ln55AvUxYrJnpLZY7vWycru3zZh2OZ5ObxVX3zAU8gMdg
//eKh4SA06/Pq2AA4DOADHINfhrlPkOfnZAAfg2Os4zbER+40maNCmARqT3IaUuw0BHIBju9uQYreRhKZf
//gMZXBI3u1+VwV1/46volGr40NLpnVueFr/NqS65Y4Vf4wvv5v0IjsJQf/cavGQwce0uZ5/j1woGH+SP4
//AT8m8EO1urW69FCFfk0POwzsgJ1Tes+3bk6V8/DPSR07DOyAnRbZ+WGzI02OeLujhxt4DrgxpF+T5oZO
//xA32OeDmpL0a6erVCOyAHZs9h/R4TrvcMHADbozKpqt8QlA3ma7wGQHYATt/PJeuQk69VFodNwzcgBtD
//M2kZxxEnBHLcMHADbozPo5t/6qmDGXgNmDE/i27eoelmBvsaMGNqDi3TnxG4ATf/MoNu7jVtMoP/bcCM
//WfkzacifCeyAHevzZ1KeP5OWTADcgBuT8mdSnj+TlvwZ3IAbc/JnUpw/w2vAjO35MynOn7GvATP258+k
//PH8GN+DG9vyZFOfPVZn5BGT0c+s=
