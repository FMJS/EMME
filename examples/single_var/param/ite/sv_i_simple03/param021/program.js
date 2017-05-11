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
      var x = new Int8Array(data.x_sab); x[0] = 1;
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
      if(id4_R_t2 == id5_R_t2) {
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
outputs[0] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 1";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 1";
outputs[4] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[5] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 0";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 1";
outputs[7] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2ktPwkAQB/C7n6JHSEhKGbokGg4QJR58JKDh2BjroYmAh3Iyfnf7Qra4a/rYxXb7v22mdGrX/rKd
//6dr2bh9+7EPbtgJ/7C29cHRpOVeB72bjYTSeHMa2vdn5b+/Rj2/n1tT67AX+yFt7oTOIzqZk1B9YvUOm
//OJrmOY1OuKgrjDpRts1LsI3jIy4zHydJfCzJ40ri2XW/rNnDtXX/aN6dJfHj/YyFUVcY5TOQMAMJM9Bp
//hnR2l/NFMr25OfuZhWF8bm7iDjfDHZyID2b5F9l/T5BdllicM823Wsf50nEyt6+7rT9dzO5WN/0LG3iA
//57/xkFY8dF48Qw6PAzzAoxmPQIgrX5bK4skzcYUrEvAAj4l4SBce0oNH9trmAA/wNKjm4c5TVPFkvwYc
//wDG53ikCh84JR/a6BjiA06RapwiccpUO4ABOB+qcOnBIBxy8qgFOG2ocUl7jEOAAjvk1DimvcQivaoBj
//fo1DymscwAGcDtQ4pLzGUQgnHjNFH0F1PzLHqzLh48skOVhtOLrvrMxDX+bxrjljJ38FE16P1YMjOMgU
//fQbNx1m5D6FPy+cipY4DP/Cj2c8fPYJfh5iSnZ98FG7gpp1uSKMbghu46d56Q3rWG4IbuDF5vSE9640e
//N7L+gAM3cNOo/kCd7QOy7kCBDQQV1hzYgZ3m9Aaq75AWVzgwAzOm9wWqb46GGZjpZk+g+jpDMAMznewH
//VF9ndJhBLwBm2tELIA29AMJ6AzuG9wJIcS8AZmDG9F4AKe4FwAzMmN4LIMW9AJiBGdN7AaS4F1DUzDd4
//NXUv
