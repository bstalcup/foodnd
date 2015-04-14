import requests
s = requests.Session()
host='http://ec2-54-152-114-24.compute-1.amazonaws.com/api'   #  replace by your host here
s.headers.update({'Accept': 'application/json'})
r = s.get(host + '/restaurants',)
print r.status_code
if r.status_code == requests.codes.ok:
    print(r.json())

r = s.get(host + '/restaurants/0559f40309a19b3949d5')
print '\n', r.status_code
if r.status_code == requests.codes.ok:
    print(r.text)

r = s.get(host + '/orders')
print '\n', r.status_code, r.text
if r.status_code == requests.codes.ok:
    print(r.json())


r = s.get(host + '/users')
print '\n', r.status_code
if r.status_code == requests.codes.ok:
    print(r.json())

r = s.get(host + '/users/b4380b1fde92cfe4c2ab')
print '\n', r.status_code
if r.status_code == requests.codes.ok:
    print(r.json())

r = s.put(host + '/orders/36d50aa1e8902d42e698/dishes/000e1e741a8788f3482c', {"userId": "b4380b1fde92cfe4c2ab", "qty": "5"});
print '\n', r.status_code
if r.status_code == requests.codes.ok:
    print(r.json())

r = s.get(host + '/users/b4380b1fde92cfe4c2ab/orders')
print '\n', r.status_code
if r.status_code == requests.codes.ok:
    print(r.json())

r = s.delete(host + '/orders/36d50aa1e8902d42e698/dishes/000e1e741a8788f3482c');
print '\n', r.status_code
if r.status_code == requests.codes.ok:
    print(r.json())

r = s.get(host + '/users/b4380b1fde92cfe4c2ab/orders')
print '\n', r.status_code
if r.status_code == requests.codes.ok:
    print(r.json())
