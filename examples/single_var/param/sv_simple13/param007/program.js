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
      var x = new Int8Array(data.x_sab); x[1] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = x[1]; report.push("id7_R_t3: "+id7_R_t3);
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0;id7_R_t3: 0";
outputs[1] = "id6_R_t3: 512;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 131072;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 131584;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 0;id7_R_t3: 2";
outputs[5] = "id6_R_t3: 512;id7_R_t3: 2";
outputs[6] = "id6_R_t3: 131072;id7_R_t3: 2";
outputs[7] = "id6_R_t3: 131584;id7_R_t3: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm09PwjAYh+9+ih01IRlbKRiNB4khXtQEDxyJyTwsEfEAJ8N3d2NjFCh/5tpukOe2vG1f2Lrfwy+8
//fX1/Op/9zGe+78VRdzwcz8Sd176Po97q2vcn0+jzK5nw3PcevN/rOArHo/EsaCUrxPLqpuUl0U56HaZR
//ubzKolnONJplzKJBMmPyEX+n8VDJocbFnnhHya7G5Z54d8/n5t9n4T2+Pnkvb5d4b8v4+o7U7Ouo1Ea7
//2gxqXqHNK7R5hTav0OZdP+uuNqrOldq5cntutsfD/mC5yRs7t3pqycp2unrfYHBoMDw0KPLB3qGVPf3K
///IsP8pdTm1+/Olv5PkpXLq58ZI7MkbkhJa8Hi41v2xe55lORPtJH+oZ+4UtKv9jgwKX0BdJH+ki/vPSr
///rDXLXz1ZTOJAxmEAAEg4AWq0KJ4JE6RoG4E4kf8iL8GN1CP9PVuoDoQAhG0ezABJmAISvxpuAuM4uZD
//l1SQ6B/9o38bdYFSnqAe9es9AUyACTDBiic4oSZQNxMETIAJMMEoE6oVC5rpEixyQt524AScwDuUrSHU
//TYqO9tWECTABJjjxDo0jwvGqg0lOqAeVQhABIrANtroQdgcVwPy/B2ErnudE+kgf6TejM8GE8E/uSwAH
//4AAcNLlbwSwOBDgAB+DgXDsY7HkD+4jYPNgMJIAEnsFSV4NZTBw5wgwQAAJAaHKngwvXYAsSO6ea4ASc
//wDhY6n4wSwoJE2ACTDjrjggX3gFOwAk4cd5dEvbKFHACTsCJy+iccF2/cMKOzZPTsAN24DGsdFPYK2vA
//CTgBJy6jw8J1tcMkO/4A88Stow==
