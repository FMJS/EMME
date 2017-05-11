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
outputs[0] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 1";
outputs[2] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 0";
outputs[4] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 0";
outputs[5] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 1";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 1";
outputs[7] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm0tvgkAUhff9FSw1MUG4MiZtXGha00UfibZxSZrSBUnVLnDV9L+XlxXpUBmYseN4dpOLHJjLfDnM
//Cdr2ehN9bCLbtsJg4M/8yL20nKsw8PJxPx4Pt2PbXq6Dt/f4x7cTa2R9dsLA9Rd+5PTisykddXtWZ6uU
//VDOdcnVYqHrcqhOrLV/CVVJ3C8rFOlXUBxU6XkU9v+6XNX64tu4fzZtZWt/NZ8CtetxqUYG4CsRVoLJC
//1t3ZZJq2d69nP7PtJ+fuNW47mcLBIf9grj/Nnx5HvUqYr5npzReJXjZOe/u6XgWj6fhuftO9sAEP4NEY
//Hrd8SA46xb4DHIBzZq5ToEqS5+SKAAfgmOs4zbHh+40iaBxAA2g0chuS7jYEcACO6W5Dkt2mJTT9EjRM
//0iua6uWyuyrjLl1WocFaQ6N6ZiILXmRpt+xY6S4Y93rsIDQcS/nTb5hgMLDvLVWew8TCgafZM/gBPzrw
//4wq9rYnS49Z4XwM7YMdA7/kFliznKT4nsAN2jPOd1uS4B7c7arhxwA24+U/PIVWeQ2AH7JjsOaTGc9Rw
//44AbcHNEbkghN3REbrDHATenkU3X+YRANJmu8RkB2AE7J55L1yFHLJUGN+DG/Ey6jePwkzVwA25Mz6Ob
//u41qZpALgBlds+g2XkPgBtycZQ7d3GtUMIMMGszon0E3/ysOHXFP44AZMKNV/kwK8mcCO2DH+PyZpOfP
//4AbcmJ8/k/T8GdyAG9PzZ5KcP5OSHA3MgBmd8meSnj+DG3Bjev5MkvNnUpI/gxkwo0/+TJLz57rMfAMn
//E3PQ
