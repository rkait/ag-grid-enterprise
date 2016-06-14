import {QuerySelector, Component, Autowired, ColumnController, PostConstruct, EventService, Events} from "ag-grid/main";

export class ReduceColumnPanel extends Component {

    @Autowired('columnController') private columnController: ColumnController;
    @Autowired('eventService') private eventService: EventService;

    private static idSequence = 0;

    @QuerySelector('.ag-rb-all-rows') private rbAllRows: HTMLInputElement;
    @QuerySelector('.ag-rb-reduce')private rbReduce: HTMLInputElement;

    constructor() {
        super(this.createTemplate());
    }

    private createTemplate(): string {
        var id = ReduceColumnPanel.idSequence++;
        return `<div class="ag-column-reduce">
                <label><input type="radio" class="ag-rb-all-rows" name="ag-column-reduce-radio-${id}"/> All Data</label>
                <label><input type="radio" class="ag-rb-reduce" name="ag-column-reduce-radio-${id}"/> Pivot</label>
            </div>`;
    }

    @PostConstruct
    private init(): void {

        this.addDestroyableEventListener(this.rbAllRows, 'change', this.onRbReduce.bind(this, false) );
        this.addDestroyableEventListener(this.rbReduce, 'change', this.onRbReduce.bind(this, true) );

        this.addDestroyableEventListener(this.eventService, Events.EVENT_COLUMN_EVERYTHING_CHANGED, this.onReduceChanged.bind(this));
    }

    private onRbReduce(value: boolean): void {
        this.columnController.setReduce(value);
    }
    
    private onReduceChanged(): void {
        if (this.columnController.isReduce()) {
            this.rbReduce.checked = true;
        } else {
            this.rbAllRows.checked = true;
        }
    }
}