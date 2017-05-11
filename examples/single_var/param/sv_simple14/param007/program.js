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
      var x = new Int16Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3);
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
outputs[4] = "id6_R_t3: 0;id7_R_t3: 512";
outputs[5] = "id6_R_t3: 512;id7_R_t3: 512";
outputs[6] = "id6_R_t3: 131072;id7_R_t3: 512";
outputs[7] = "id6_R_t3: 131584;id7_R_t3: 512";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt3T1vE0EQgOGeX3ElSJHOd+uzEYiCCEU0gBQKSgvJFJYIoXAqlP+Ov2JvkrWTy87M7p7ezlr71vHH
//PJmwM0xdX98s/94s67pazCezy9nSvatG7xfz6d3tur66nv/6vXrA5/PqQ/Xv9WLezn7Mls3Z6gq3ufXm
//rFqtjte32/Vqt7m1Xd3uuV7d7rhdbVaPuPq5+LNeb709/HV3ZH3s7e6vd0fWJ0eed/fz3FYfv36qvnwb
//4mvbrB9ekb/7YbULrk6CO/j7uuC+LrivC+7rgvse3utJcNV/bBd8bPfwsdvP+PL8YvMh3/vk7t611ZWj
//9dXH7mxO3dmeutPt7pyees5p+Dl3P/jF7ssZ3D989fbK7z/WV96+qglzwpwwF4rkw537D36kH+SBZyX0
//CX1CX+g3fM/Q33/AjWXoO0Kf0Cf0+4d+7C/21IHvf9kkOeiaFhAAgVwgRov9W2JKgv9BEPwEP8GfIBtI
//E/rhbCAehMY1oykmYAIJQY9/NHwMxv7Ft5YqdMQ/8U/8a5wL9MoJ0kR/OCfABEzABJWc4BlnAqlNcJiA
//CZggakLcYUGeWYKiE93bMU7gBLlD3zOE1FKMg19NTMAETDDJHbIT4elTB0knKFSCCNIGky6Ex2eXHksv
//70F4sL7bk9An9An9PDoTJAL/2X0JcAAHcJBzt4IsBw4O4AAOSu1g0MsN9ImgsBkkyBlMuhpkmXiihBkQ
//AAEQcu50sMgatJCgqgknSBysuh9kpegwARMwoeiOCIvcASdwAifK7pLQO6bACZzAiWF0TlifX5jYQeU0
//dpBjGHRT6B1r4ARO4MQwOiysTzv07aC4CjZILxLNfvD+5hHrunCEPqFP6Oc9D6J/4L+06wIO4AAOMp8R
//EcOBgwM4gIPhzI2Qyg30iaDIGiTIGRLNkohhol9BNSAAAiBkPl9CPmvQQoKKKJwgcUg3cyJGig4TMAET
//BjaHQj53wAmcwImhzaaQOqbACZzAiaHOq9A9vzCxg2pq7CDHSDLDQupYAydwAieGOtdC97RD3w6Kq2CD
//9EKv6+JEXXZMz0W49JqwJ+wJ+/QdF6JB/1S/BRRAARTk2m2hRIGDAiiAgoI6LQxyAm0eKKoGCHIFvS4L
//JSLC5dNgAAZgkGuHhWm2oAMElU8YQcKg2l2hpESHB3iAB6V1VpjmDBiBERhRXFeFwXEERmAERhTbUZHs
//nMLADaqkcYPcQqubwuD4AiMwAiOK7aRIdqqh7YZfONU1LWiABomF3fQKTyOx6RW7PQl+gp/gz3d+Rf/Q
//f+n8CkAABEDIfoJFDAgOEAABEIY0w0IqP9BH4n5BNUzABHmD4RSLGCj6/Qf1kAAJkJD9HAv5zEGLiUcV
//UUiBFCQPhpMsYqzoUAEVUGFwsyzk8wekQAqkGN40C6kjC6RACqQY7jwL3bMMEz3uV1ejB3qQZ5hNtJA6
//4kAKpECK4c600D350NeDcivgIMVINNUiphcjXJBN4BP4BH7mcy3k+zDAAAzAoMjJFvI9GGAABmBQ4GwL
//q/6LWCAotYYI8oVE0y3key/gAA7goMj5FlZ9F7FEUAuFEiQN6SZcyPdcIAIiIEKpMy6s+i1QAiVQotQp
//F1a9FiiBEihR5pyLtH0WAnJQO40c5BdJJl1Y9VigBEqgRJmzLtL2Vzxfjv9wOGIR
