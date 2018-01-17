import assert from 'assert'
import * as f from '../../helpers/f'

const arrM = [
  {name: 'model/01.dds', size: 1},
  {name: 'model/01.jpg', size: 2},
  {name: 'model/01.png', size: 3}
]

const arr = [ [ [{name: '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/__MACOSX/._male02.mtl', size: 1} ],
  [{name: '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/__MACOSX/._male02.obj', size: 2} ] ],
  [{name: '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/male02.mtl', size: 1} ],
  [ {name: '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/male02.obj', size: 2} ],
  [{name: '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/male02_bin.bin', size: 3} ],
  [{name: '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/male02_bin.js',size: 4} ] ]
const cutted = [
  {name: 'male02.mtl',size: 1},
  {name: 'male02.obj', size: 2},
  {name: 'male02_bin.bin',size: 3},
  {name: 'male02_bin.js', size: 4}
]
const arrFlat = [{name: '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/__MACOSX/._male02.mtl', size: 1},
  {name: '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/__MACOSX/._male02.obj', size: 2},
  {name: '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/male02.mtl', size: 1},
  {name: '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/male02.obj', size: 2},
  {name: '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/male02_bin.bin', size: 3},
  {name: '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253/male02_bin.js', size: 4}
]
const arr2 = [
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/__MACOSX/model/._.DS_Store",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/__MACOSX/model/._01.dds",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/__MACOSX/model/._02.dds",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/__MACOSX/model/._03.dds",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/model/.DS_Store",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/model/01.dds",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/model/02.dds",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/model/03.dds",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/model/male02.obj",
    "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/model/male02_dds.mtl"
]
const arr3 = [
  {name: "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/model/male02.obj", size: 10},
  {name:  "/Users/liuhaibao/source/assets/static/upload/20177/1499179623917/model/male02_dds.mtl", size: 13}
]


describe('f', function() {
  describe('#readdirPromisify()', function() {
    it('should return files ', async () => {
      const files = await f.readdirPromisify('/Users/liuhaibao/source/assets/test')
      assert.deepEqual(files, ['specs','unit']);
    });
  });

  describe('#statPromisify()', function() {
    it('should return files ', async () => {
      const stat = await f.statPromisify('/Users/liuhaibao/source/assets/test')
      // console.log("stat: " + stat.isDirectory())
      assert.equal(true, stat.isDirectory());
    });
  });

  describe('#listDir()', function() {
    it('should return files ', async () => {
      const files = await f.listDir('/Users/liuhaibao/source/assets/test/unit/f')
      // console.log(files)
      const arr = files.reduce((a,b) => { return a.concat(b) })
      assert.deepEqual(arr, [{name: '/Users/liuhaibao/source/assets/test/unit/f/a.txt', size: 10},
                       {name: '/Users/liuhaibao/source/assets/test/unit/f/b.txt', size: 6}]);
    });
  });

  describe('#removePrefix()', function() {
    it('should replace prefix', async () => {
      const relative = f.removePrefix({name: '/Users/liuhaibao/source/assets/test.js', size: 0}, '/Users/liuhaibao/source')
      assert.equal(relative.name, 'assets/test.js');
    });
  });

  describe('#regenRelative()', function() {
    it('#regenRelative', async () => {
      const relative = f.regenRelative(arr3, '/Users/liuhaibao/source')
      // console.log('relative ff: ' + relative)
      assert.deepEqual(relative, [{name: 'assets/static/upload/20177/1499179623917/model/male02.obj', size: 10},
                       {name: 'assets/static/upload/20177/1499179623917/model/male02_dds.mtl', size: 13}]);
    });

  });


  describe('#flat()', function() {
    it('should flat prefix', async () => {
      const r = f.flat(arr)
      assert.deepEqual(r, arrFlat);
    });
  });
  describe('#strArr()', function() {
    it('should flat refine', async () => {
      const r = f.struArr(arr, '/Users/liuhaibao/source/assets/static/upload/20177/1499160613253')
      assert.deepEqual(r,cutted );
    });
  });

  describe('#mArray()', function() {
    it('should return a element of png jpeg jpg', async () => {
      const m = f.mArray(arrM)
      assert.deepEqual(m,{name: 'model/01.dds', size: 1});
    });
  });

  describe('#mArray()', function() {
    it('should return a element of png jpeg jpg', async () => {
      const parent = 'http://aa.com'
      const mname = 'model/01.dds'
      const m = f.matPath(parent, mname)
      assert.equal(m,'http://aa.com/model');
    });
  });


});
