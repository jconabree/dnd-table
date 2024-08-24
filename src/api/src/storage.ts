import path from 'path';
import fs from 'fs';
import{ v6 as uuidv6 } from 'uuid';

type LooseData = {
    [key: string]: any;
    isNew?: boolean;
};

type LooseDataWithItems = LooseData & {
    items: BasicItemData[]
}

type BasicItemData = {
    id?: string;
    savedAt?: number;
    createdAt?: number;
}

class NoEntityFound extends Error {}

interface EntityInterface {
    get data(): LooseData;

    setStorage(storage: Storage): EntityInterface;

    setIsNew(status: boolean): EntityInterface;

    save(): void;
}

class Entity<DataStructure extends LooseData|LooseDataWithItems> implements EntityInterface {
    private storage: Storage|null = null;

    constructor(
        private type: string,
        private _data: DataStructure
    ) {
    }

    get data(): DataStructure {
        return this._data;
    }

    setData(data: DataStructure): Entity<DataStructure> {
        this._data = {
            ...data
        };

        return this;
    }

    updateData(data: Partial<DataStructure>): Entity<DataStructure> {
        this._data = {
            ...this._data,
            ...data
        };

        return this;
    }

    setStorage(storage: Storage): Entity<DataStructure> {
        this.storage = storage;

        return this;
    }

    setIsNew(status: boolean): Entity<DataStructure> {
        this._data.isNew = status;

        return this;
    }

    saveItem<ItemData extends BasicItemData>(item: ItemData): ItemData {
        item.savedAt = Date.now();
    
        if (!item.id) {
            item.id = uuidv6() as string;
            item.createdAt = item.savedAt;
        }

        this.data.items = [
            item,
            ...(this.data.items || []).filter((existingItem: ItemData) => {
                return item.id !== existingItem.id;
            }),
        ]

        this.save();

        return item;
    }

    save(): void {
        this.setIsNew(false);
        
        this.storage!.save(
            this.type,
            this.data
        );
    }
}

class Storage {
    root: string;
    constructor() {
        this.root = path.join(__dirname, '..', '..', '..', 'storage');
    }

    getFilePath(type: string): string {
        return path.join(this.root, `${type}.json`);
    }

    load<DataStructure extends LooseData>(type: string): Entity<DataStructure> {
        const file = this.getFilePath(type);

        let existingData = {};
        let isNew = true;
        if (fs.existsSync(file)) {
            existingData = JSON.parse(
                fs.readFileSync(file, 'utf-8')
            );
            isNew = false;
        }

        const entity = new Entity<DataStructure>(
            type,
            existingData as DataStructure
        );
        entity.setIsNew(isNew);
        entity.setStorage(this);

        return entity;
    }

    save(type: string, data: LooseData): this {
        const file = this.getFilePath(type);

        fs.writeFileSync(file, JSON.stringify(data));

        return this;
    }
}

export default new Storage();